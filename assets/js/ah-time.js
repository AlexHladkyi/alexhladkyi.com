(function () {
  var TIME_ZONE = "Europe/Kyiv"; // IANA
  var SHOW_SECONDS = false;

  var el = document.getElementById("ah-time");
  if (!el) return;

  // Hide if browser doesn't know the time zone
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE });
  } catch (e) {
    (el.closest("p") || el).style.display = "none";
    return;
  }

  // Follow 12h / 24h sys pref
  var hc = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hourCycle;
  var is12h = hc === "h11" || hc === "h12";

  var opts = {
    timeZone: TIME_ZONE,
    hour: is12h ? "numeric" : "2-digit",
    minute: "2-digit",
    hourCycle: is12h ? "h12" : "h23"
  };
  if (SHOW_SECONDS) opts.second = "2-digit";
  var timeFmt = new Intl.DateTimeFormat(undefined, opts);

  var wallFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
    hourCycle: "h23"
  });

  el.style.fontVariantNumeric = "tabular-nums";

  var colons = [];
  function makeColon() {
    // "0:0" colon alignment 
    var c = document.createElement("span");
    c.textContent = "0:0";
    c.style.margin = "0 -1ch";
    c.style.clipPath = "inset(0 1ch)";
    c.style.userSelect = "none";
    c.setAttribute("aria-hidden", "true");
    colons.push(c);
    return c;
  }

  // Build: hour : minute [: second] [ AM/PM] (UTC±x)
  var hourNode = document.createTextNode("");
  var minNode = document.createTextNode("");
  var secNode = document.createTextNode("");
  var periodNode = document.createTextNode("");
  var shiftNode = document.createTextNode("");
  el.textContent = "";
  el.append(hourNode, makeColon(), minNode);
  if (SHOW_SECONDS) el.append(makeColon(), secNode);
  el.append(periodNode, shiftNode);

  function utcLabel(now) {
    var p = {};
    wallFmt.formatToParts(now).forEach(function (x) { p[x.type] = +x.value; });
    var wallAsUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    var tzOffset = Math.round((wallAsUTC - Math.floor(now / 1000) * 1000) / 60000);
    var sign = tzOffset < 0 ? "-" : "+";
    var abs = Math.abs(tzOffset);
    var h = Math.floor(abs / 60), m = abs % 60;
    return " (UTC" + sign + h + (m ? ":" + String(m).padStart(2, "0") : "") + ")";
  }

  function tick() {
    var now = new Date();
    var period = "";
    timeFmt.formatToParts(now).forEach(function (x) {
      if (x.type === "hour") hourNode.nodeValue = x.value;
      else if (x.type === "minute") minNode.nodeValue = x.value;
      else if (x.type === "second") secNode.nodeValue = x.value;
      else if (x.type === "dayPeriod") period = " " + x.value;
    });
    periodNode.nodeValue = period;
    shiftNode.nodeValue = utcLabel(now);
    // Colon blink
    var vis = now.getSeconds() % 2 === 0 ? "visible" : "hidden";
    colons.forEach(function (c) { c.style.visibility = vis; });
  }

  tick();
  setInterval(tick, 500);
})();