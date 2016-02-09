/** Offset Shortcuts map */
const shortcuts = {
  center: [.5, .5],
  origin: [0, 0]
}

/**  Known X offsets names */
const xOffsets = {
  left: 0,
  center: .5,
  right: 1,
}

/** Known Y offsets names */
const yOffsets = {
  top: 0,
  middle: .5,
  bottom: 1
}


/**
 * @param {Number} v
 * @returns {String}
 */
const toPixels = v => `${v}px`


function each(o, fn, ctx = null) {
  for (let prop in o) {
    if (o.hasOwnProperty(prop)) {
      fn.apply(ctx, [o[prop], prop, o])
    }
  }
}

function assign(...args) {
  return args.slice(1).reduce(
    (acc, curr) => {
      each(curr, (v, k) => acc[k] = v)
      return acc
    }, args[0]
  )
}


function mapObject(o, fn, ctx = null) {
  var n = {}
  each(o, (v, k) => n[k] = fn.apply(ctx, [v, k, o]), ctx)
  return n
}

function filterObject(o, fn, ctx = null) {
  var n = {}
  each(o, (v, k) => fn.apply(ctx, [v, k, o]) && (n[k] = v), ctx)
  return n
}


function diff(a, b) {

  const diffTypes = {update: 'update', add: 'add', remove: 'remove'}
  const map = []

  // Updates and additions
  each(b, (v, k) => {
    if (!(k in a)) {
      map.push({type: diffTypes.add, prop: k, value: v})
    } else if (v !== a[k]) {
      map.push({type: diffTypes.update, prop: k, value: v, diff: a[k]})
    }
  })

  // Deletion
  each(a, (v, k) => {
    if (!(k in b)) {
      map.push({type: diffTypes.remove, prop: k, value: v})
    }
  })

  return {map, hasDiff: () => map.length !== 0}
}


var vec = (function vector() {
  var vectProto = {
    plus: function (v) {
      return vec(this.left + v.left, this.top + v.top)
    },
    minus: function (v) {
      return vec(this.left - v.left, this.top - v.top)
    }
  }
  return function vec(...args) {
    let c = args.length === 1 ? args[0] : {
      left: args[0],
      top: args[1]
    }
    return assign(Object.create(vectProto), c)
  }
})()

/**
 * Apply styles to the element
 * @param el
 * @param styles
 */
function style(el, styles) {
  for (let prop in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, prop)) {
      el.style[prop] = styles[prop]
    }
  }
}


/**
 * Parse a string offset of type 'top center' to the translated [0, 0.5]
 * @param {String} offsets
 * @returns {Number[]}
 */
function parseOffsets(offsets) {

  var o = offsets.split(' ')

  // A shortcut or only Y offset has bee given
  if (o.length === 1) {
    var o = o.shift()
    o in shortcuts ?
      o = shortcuts[o] :
      o = [yOffsets[o], xOffsets['left']]
  } else {
    o = [yOffsets[o[0]], xOffsets[o[1]]]
  }

  return o
}


/**
 * Return an 'in document' (absolute) bounding box of el
 * @param {Element] el
 * @returns {{left: number, top: number, width: number, height: number}}
 */
function getBox(el) {

  var {left, top, width, height}  = el.getBoundingClientRect()

  var scroll = vec(
    window.pageXOffset || window.scrollX,
    window.pageYOffset || window.scrollY
  )

  return mapObject(
    assign({width, height}, scroll.plus(vec(left, top))),
    v => Math.round(v)
  )
}


/**
 * Actual calculation of the 'snapping' points offsets of a given element
 * @param {Element} el
 * @returns {Function}
 */
function compute(el) {
  let {left, top, width, height} = getBox(el)
  return function (offsets) {
    offsets = parseOffsets(offsets)
    return vec(
      left + (width * offsets[1]),
      top + (height * offsets[0])
    )
  }
}


/**
 * Internal object caching
 * No need to recompute everything each time a snap is declared
 * @type {{set, get, remove}}
 */
let cache = (function bindings() {
  var c = []
  return {
    set: o => c.push(o),
    get: el => c.find(i => i.el === el) || null,
    remove: o => c = c.filter(i => i !== o),
    isEmpty: () => c.length === 0
  }
})()


/**
 * Utility function that creates/get from cache an object produced by fn
 * @param {Element} el
 * @param {Function} fn
 * @returns {Object}
 */
function create(el, fn) {
  var o = cache.get(el)
  if (!o) {
    o = fn()
    cache.set(o)
  }
  return o
}


var listener = (function listener() {

  var events = {scroll: null, resize: null}
  var observers = []

  var createEvent = function (target, event) {
    return {
      forEach(fn){
        target.addEventListener(event, fn)
        return {
          dispose(){
            target.removeEventListener(event, fn)
          }
        }
      }
    }
  }

  function update() {

    for (let i = 0; i < observers.length; i++) {
      var t = observers[i]

      t.computation = compute(t.el)

      each(t.targets, function (i, offset) {

        i.snapped.computation = compute(i.snapped.el)
        i.snapped.snapPoint = i.snapped.computation('origin')
          .minus(i.snapped.computation(i.snapped.baseOffset)) // => here, we want snap target offset

        i.snapPoint = t.computation(offset)

        move(i.snapped, i.snapPoint)
      })
    }
  }

  return {
    init(snappTarget){

      if (observers.indexOf(snappTarget) === -1) {
        observers.push(snappTarget)
      }

      if (!events.scroll && !events.resize) {
        events = {
          scroll: createEvent(window, 'scroll').forEach(update),
          resize: createEvent(window, 'resize').forEach(update)
        }
      }

    },
    dispose(){
      observers = []
      events = mapObject(events, e => {
        e.dispose()
        return null
      })
    }
  }

})()


function dispose(snapped, snapTarget) {

  return function () {

    // Removing from cache
    cache.remove(snapped)

    // Unreferencing on snapTarget
    snapTarget.targets = filterObject(snapTarget.targets, (v, k) => {
      return v.snapped !== snapped
    })

    // Check that snapTarget have some targets left. If not => unbind it
    if (!Object.keys(snapTarget.targets).length) {
      cache.remove(snapTarget)
    }

    // If there is nothing left in the cache
    // dispose every event listener
    if (cache.isEmpty()) {
      listener.dispose()
    }
  }
}

// TODO : recompute on scroll and resize
export default function snap(el, offset, offsetLeft = 0, offsetTop = 0) {


  // Create a snapped object if not cached. Get it otherwise
  var snapped = create(el, () => ({
    el: el,
    memo: {},
    computation: compute(el),
    baseOffset: offset
  }))

  snapped.dispose = dispose

  // Pivot computation
  snapped.snapPoint = snapped.computation('origin')
    .minus(snapped.computation(offset))
    .minus(vec(offsetLeft, offsetTop))


  // Returns an object allowing us to do snap(opts).to(target)
  return {

    to: function (target, offset) {

      let snapTarget

      // Again, create a snap target object if not cached. Get it otherwise
      snapTarget = create(target, () => ({
        el: target,
        computation: compute(target),
        targets: {}
      }))

      // Target pivots computation
      // A snap target can have multiple snapped objects
      snapTarget.targets[offset] = {
        snapped: snapped,
        snapPoint: snapTarget.computation(offset)
      }

      move(snapped, snapTarget.targets[offset].snapPoint)

      // Init scroll / resize listener
      // Events attachment will occur only once
      listener.init(snapTarget)

      return {
        dispose: dispose(snapped, snapTarget)
      }
    }
  }
}

function move(snapped, snapTarget) {

  // Compute the styles
  let styles = mapObject(
    snapped.snapPoint.plus(snapTarget),
    val => toPixels(val)
  )

  // Applies only if it the initial rendering
  // or if it has diffs
  if (diff(snapped.memo, styles).hasDiff()) {
    snapped.memo = styles
    style(snapped.el, styles)
  }
}

