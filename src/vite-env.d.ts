/// <reference types="vite/client" />

// Pulls in Vite's ambient types, `import.meta.env` among them. The project had been
// building without this only because nothing had reached for those types yet; the CV link
// needs BASE_URL to survive being served from a subpath.
