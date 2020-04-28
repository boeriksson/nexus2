import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {scriptSelector} from "./microFrontendsReducer";
import {fetchScriptSuccess} from "./microFrontendsActions";
import NotificationManager from "../../../js/NotificationManager";
import ErrorHandler from "../../../js/ErrorHandler";

async function fetchWebComponent(src, etag, signal) {
    const response = await fetch(src, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/javascript',
            ...(etag && {'If-None-Match': etag})
        },
        signal
    });

    const {status} = response;
    if (!response.ok && status !== 304) {
        const body = await response.text();
        const errorMessage = `Server responded with status: ${status}\n${body}`;
        throw new Error(errorMessage);
    }

    return response;
}

export default (src, name, deps) => {
    const {etag, seq} = useSelector(scriptSelector(src));
    const dispatch = useDispatch();
    useEffect(() => {
        const abortController = new AbortController();
        (async () => {
            try {
                const response = await fetchWebComponent(src, etag, abortController.signal);
                if (response.status !== 304) {
                    const blob = await response.blob();
                    const module = await import(/* webpackIgnore: true */ URL.createObjectURL(blob));
                    const nextSeq = seq + 1;
                    customElements.define(`${name}_${nextSeq}`, module.default);
                    dispatch(fetchScriptSuccess(src, response.headers.get('Etag'), nextSeq));
                }
            } catch (e) {
                if (e.name !== 'AbortError') {
                    ErrorHandler.error(e);
                    NotificationManager.showSystemError({
                        header: 'Ett fel uppstod',
                        message: `Script: ${src}`,
                        detailedMessage: e.toString && e.toString()
                    });
                }
            }
        })();
        return () => { abortController.abort(); };
    }, deps);
    return etag && `${name}_${seq}`;
};
