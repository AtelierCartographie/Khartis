import Ember from 'ember';
import config from 'khartis/config/environment';
import d3 from 'npm:d3';
import {concatBuffers, uint32ToStr, calcCRC, build_pHYs, build_tEXt, tracePNGChunks} from 'khartis/utils/png-utils';
import {isSafari} from 'khartis/utils/browser-check';
import { exportAsHTML } from 'khartis/utils/svg-exporter';

export default Ember.Mixin.create({

    exportSVG(targetIllustrator) {
        let compatibility = targetIllustrator ? { illustrator: true } : undefined,
            html = exportAsHTML(
                d3.select("svg.map-editor"),
                this.get('model.graphLayout.width'),
                this.get('model.graphLayout.height'),
                compatibility
            ),
            blob = new Blob([html], { type: isSafari() ? "application/octet-stream" : "image/svg+xml" });
        saveAs(blob, "export_khartis.svg");
    },

    exportPNG(fact = 1) {

        let svgString = exportAsHTML(
            d3.select("svg.map-editor"),
            this.get('model.graphLayout.width'),
            this.get('model.graphLayout.height')
        );

        let canvas = document.getElementById("export-canvas");
        canvas.width = this.get('model.graphLayout.width') * fact;
        canvas.height = this.get('model.graphLayout.height') * fact;
        let ctx = canvas.getContext("2d");
        ctx.scale(fact, fact);
        let DOMURL = self.URL || self.webkitURL || self;
        let img = new Image();
        let svg = new Blob([svgString], { type: "image/svg+xml" });
        let url = DOMURL.createObjectURL(svg);

        img.onerror = function (e) {
            console.log(e, e.message);
        };

        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function (blob) {

                var arrayBuffer;
                var fileReader = new FileReader();
                fileReader.onload = function () {

                    arrayBuffer = this.result;
                    let dv = new DataView(arrayBuffer),
                        firstIDATChunkPos = undefined,
                        pos = 8,
                        getUint32 = function () {
                            var data = dv.getUint32(pos, false);
                            pos += 4;
                            return data;
                        };

                    //find first IDAT chunk
                    while (pos < dv.buffer.byteLength) {
                        let size = getUint32(),
                            name = uint32ToStr(getUint32());
                        if (name === "IDAT" && !firstIDATChunkPos) {
                            firstIDATChunkPos = pos - 8;
                            break;
                        } else {
                            pos += size;
                        }
                        getUint32(); //crc
                    }

                    let left = arrayBuffer.slice(0, firstIDATChunkPos),
                        right = arrayBuffer.slice(firstIDATChunkPos);

                    let extraBuffer = build_pHYs(Math.round(72 * fact));

                    let meta = {
                        "Comment": "Made with Khartis",
                        "Software": "Khartis"
                    };

                    for (let k in meta) {
                        extraBuffer = concatBuffers(build_tEXt(k, meta[k]), extraBuffer);
                    }

                    let pngBuffer = concatBuffers(concatBuffers(left, extraBuffer), right);

                    //tracePNGChunks(pngBuffer);

                    saveAs(new Blob([pngBuffer], { type: isSafari() ? "application/octet-stream" : "image/png" }), "export_khartis.png");
                    DOMURL.revokeObjectURL(url);

                };
                fileReader.readAsArrayBuffer(blob);

            }, "image/png", 1);


        };
        img.src = url;

    },

    makeThumbnail() {

        if (d3.select("svg.map-editor").empty()) return Promise.resolve();

        let svgString = exportAsHTML(
            d3.select("svg.map-editor"),
            this.get('model.graphLayout.width'),
            this.get('model.graphLayout.height')
        );

        let fact = 1,
            h = config.projectThumbnail.height,
            w = config.projectThumbnail.width,
            imgWidth = this.get('model.graphLayout.width') * fact,
            imgHeight = this.get('model.graphLayout.height') * fact,
            s = w / imgWidth;
        let canvas = document.getElementById("export-canvas");
        canvas.width = w;
        canvas.height = h;
        let ctx = canvas.getContext("2d");
        ctx.scale(fact, fact);
        let DOMURL = self.URL || self.webkitURL || self;
        let img = new Image();
        let svg = new Blob([svgString], { type: "image/svg+xml" });
        let url = DOMURL.createObjectURL(svg);

        return new Promise((res, rej) => {

            img.onload = function () {
                ctx.drawImage(img, 0, (imgHeight - h / s) / 2, imgWidth, h / s, 0, 0, w, h);
                res(canvas.toDataURL("image/jpeg", config.projectThumbnail.quality));
                DOMURL.revokeObjectURL(url);
            };
            img.onerror = function (e) {
                rej(e);
            };
            img.src = url;

        }).catch(console.log);

    }


});