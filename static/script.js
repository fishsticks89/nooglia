
const prod = window.location.hostname.indexOf("nooglia") != -1;
// Hotjar Tracking Code for https://nooglia.com
if (prod)
    (function (p, e, n, i, s) {
        p.hj = p.hj || function () { (p.hj.q = p.hj.q || []).push(arguments) };
        p._hjSettings = { hjid: 3177735, hjsv: 6 };
        s = e.getElementsByTagName('head')[0];
        let r = e.createElement('script'); r.async = 1;
        r.src = n + p._hjSettings.hjid + i + p._hjSettings.hjsv;
        s.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

if (!prod)
    setInterval(() => {
        [...document.getElementsByClassName("firebase-emulator-warning")].forEach(element => {
            // element.style.backgroundColor = "transparent"
            element.remove();
        });
    }, 200);

if (prod) {

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'G-VC9747164E');
}

if (prod)
    (function (f, b) {
        if (!b.__SV) {
            var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) {
                function g(a, d) { var b = d.split("."); 2 == b.length && (a = a[b[0]], d = b[1]); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))) } } var a = b; "undefined" !== typeof c ? a = b[c] = [] : c = "mixpanel"; a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d }; a.people.toString = function () { return a.toString(1) + ".people (stub)" }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
                for (h = 0; h < i.length; h++)g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]) } } for (var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++)b(j[c]); return d }; b._i.push([e, f, c])
            }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ?
                MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g)
        }
    })(document, window.mixpanel || []);


// Enabling the debug mode flag is useful during implementation,
// but it's recommended you remove it for production

let readyToMix = false;
try {
    mixpanel.init('7309a913f64760d4b084f0a0922b3d75', {
        debug: !prod,
        loaded: () => {
            readyToMix = true;
            console.log(mixpanel)
        }
    });
} catch (error) {
    console.error(error);
}

window.mixEvent = (ev) => {
    if (readyToMix)
        mixpanel.track(ev)
    else
        console.error("No mixing? lmao")
}

window.mix = (f) => {
    if (readyToMix)
        try {
            f(mixpanel)
        } catch (error) {
            console.error(error)
        }
    else
        console.error("No mixing? lmao")
}