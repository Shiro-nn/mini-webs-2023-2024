import extensions from "./extensions";
import helper from "./helper";

import del from "./methods/delete";
import get from "./methods/get";
import patch from "./methods/patch";
import post from "./methods/post";
import put from "./methods/put";

helper.checkRun();

const method = extensions.getArg("method");

switch (method?.toLowerCase()) {
    case "delete": {
        del().catch((err) => console.log(err));
        break;
    }

    case "get": {
        get().catch((err) => console.log(err));
        break;
    }

    case "patch": {
        patch().catch((err) => console.log(err));
        break;
    }

    case "post": {
        post().catch((err) => console.log(err));
        break;
    }

    case "put": {
        put().catch((err) => console.log(err));
        break;
    }

    default: {
        console.warn("Неизвестный метод: " + method);
        console.log("Введите --help для получения списка методов");
        break;
    }
}