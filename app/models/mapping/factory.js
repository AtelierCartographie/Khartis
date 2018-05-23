import Mapping from "./mapping";
import MultiMapping from "./multi-mapping";

export const MappingFactory = (json, refs) => {
  if (json.isMulti) {
    return MultiMapping.restore(json, refs);
  } else {
    return Mapping.restore(json, refs);
  }
}