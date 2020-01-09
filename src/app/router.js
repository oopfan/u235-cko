define(["knockout", "crossroads", "hasher"], function(ko, crossroads, hasher) {

    // This module configures crossroads.js, a routing library. If you prefer, you
    // can use any other routing library (or none at all) as Knockout is designed to
    // compose cleanly with external libraries.
    //
    // You *don't* have to follow the pattern established here (each route entry
    // specifies a 'page', which is a Knockout component) - there's nothing built into
    // Knockout that requires or even knows about this technique. It's just one of
    // many possible ways of setting up client-side routes.

    return new Router({
        routes: [
            { url: '',                            params: { page: 'home' } },
            { url: 'about',                       params: { page: 'about' } },
            { url: 'privacy',                     params: { page: 'privacy' } },
            { url: 'g2v-star-database',           params: { page: 'g2v-star-database' } },
            { url: 'lrgb-exposure',               params: { page: 'lrgb-exposure' } },
            { url: 'lrgb-stack-balance',          params: { page: 'lrgb-stack-balance' } },
            { url: 'color-balance',               params: { page: 'color-balance' } },
            { url: 'color-balance-instructions',  params: { page: 'color-balance-instructions' } },
            { url: 'astrocalc-v1',                params: { page: 'astrocalc-v1' } },
            { url: 'astrocalc-v1-instructions',   params: { page: 'astrocalc-v1-instructions' } },
            { url: 'astrocalc-release-notes',     params: { page: 'astrocalc-release-notes' } },
            { url: 'snrcalc-telescope-profiles',  params: { page: 'snrcalc-telescope-profiles' } },
            { url: 'snrcalc-camera-profiles',     params: { page: 'snrcalc-camera-profiles' } },
            { url: 'snrcalc-observatory-profiles', params: { page: 'snrcalc-observatory-profiles' } },
            { url: 'snrcalc-target-profiles',     params: { page: 'snrcalc-target-profiles' } },
            { url: 'snrcalc-calculator',          params: { page: 'snrcalc-calculator' } }
        ]
    });

    function Router(config) {
        var currentRoute = this.currentRoute = ko.observable({});

        ko.utils.arrayForEach(config.routes, function(route) {
            crossroads.addRoute(route.url, function(requestParams) {
                currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });

        activateCrossroads();
    }

    function activateCrossroads() {
        function parseHash(newHash, oldHash) { crossroads.parse(newHash); }
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    }
});
