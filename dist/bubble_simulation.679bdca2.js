(function() {
    try {
        const t = localStorage.getItem("theme");
        if (t) document.documentElement.setAttribute("data-theme", t);
        else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.setAttribute("data-theme", "dark");
    } catch (e) {}
})();

//# sourceMappingURL=bubble_simulation.679bdca2.js.map
