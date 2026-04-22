import React, { useEffect, useRef } from 'react';

const TranslateWidget = () => {
    const scriptRef = useRef(null);

    useEffect(() => {
        if (!scriptRef.current) {
            const script = document.createElement("script");
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
            scriptRef.current = script;

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
            }

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);

    return (
        <div id="google_translate_element"></div>
    );
}

export default TranslateWidget;
