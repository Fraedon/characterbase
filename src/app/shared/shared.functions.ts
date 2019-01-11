export const getExt = (fileName) =>
    fileName.lastIndexOf(".") < 1 ? null : fileName.split(".").slice(-1);