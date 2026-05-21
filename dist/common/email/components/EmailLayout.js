"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EmailLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
function EmailLayout({ children, }) {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsx)(components_1.Body, { style: styles.body, children: (0, jsx_runtime_1.jsxs)(components_1.Container, { style: styles.container, children: [(0, jsx_runtime_1.jsx)(components_1.Section, { style: styles.header, children: (0, jsx_runtime_1.jsx)(components_1.Img, { src: "https://res.cloudinary.com/debacodes/image/upload/v1775666603/logo_la6fac.png", width: "120", alt: "Plasticonn" }) }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: styles.content, children: children }), (0, jsx_runtime_1.jsx)(components_1.Section, { style: styles.footer, children: (0, jsx_runtime_1.jsxs)(components_1.Text, { style: styles.footerText, children: ["\u00A9 ", new Date().getFullYear(), " Plasticonn"] }) })] }) })] }));
}
const styles = {
    body: {
        backgroundColor: "#f4f4f7",
        fontFamily: "Arial, sans-serif",
    },
    container: {
        backgroundColor: "#ffffff",
        maxWidth: "520px",
        margin: "0 auto",
        borderRadius: "10px",
        overflow: "hidden",
    },
    header: {
        backgroundColor: "#005C3D",
        padding: "20px",
        textAlign: "center",
    },
    content: {
        padding: "30px",
    },
    footer: {
        backgroundColor: "#f4f4f7",
        padding: "15px",
        textAlign: "center",
    },
    footerText: {
        fontSize: "12px",
        color: "#888",
    },
};
