export const urlencode = a => {
  if (window.URLSearchParams) {
    return new URLSearchParams(a).toString();
  } else {
    return `${Object.keys(a)
      .map(b => `${encodeURIComponent(b)}=${encodeURIComponent(a[b])}`)
      .join("&")}`;
  }
};
export const __random__ = (a = 15) => {
  return [...Array(a)]
    .map(() => (~~(16 * Math.random())).toString(16))
    .join("");
};
export const getRandom = (a = 15) =>
  [...Array(a)]
    .join(".")
    .replace(/[.]/g, b =>
      (
        b ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (b / 4)))
      ).toString(16)
    );
export const loadHash = hash => {
  if ("string" == typeof hash)
    return "/" === hash[0]
      ? void (location.hash = hash)
      : void (location.hash = `/${hash}`);
};
export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
export const stampFormat = timeStamp => {
  try {
    const formatOptions = {
        hour: "numeric",
        hour12: !0,
        minute: "numeric"
      },
      stampDate = new Date(timeStamp),
      currentDate = new Date();
    if (
      (stampDate.getFullYear() !== currentDate.getFullYear() &&
        (formatOptions.year = "numeric"),
      isSameDay(stampDate, currentDate) ||
        (formatOptions.month = formatOptions.day = "numeric"),
      stampDate.getMonth())
    )
      return Intl.DateTimeFormat("auto", formatOptions).format(stampDate);
  } catch (d) {
    return console.log(d), new Date(timeStamp).toLocaleString();
  }
};
export const parseHash = (route = window.location.href) => {
  const _currentRoute = e => {
    const f = e.split("/").filter(h => h)[0];
    if (f) {
      return `/${f}/`;
    } else {
      return "/";
    }
  };
  let url, url2;
  if ("#" === route[0]) {
    url = route.substr(1);
  } else
    try {
      url2 = new URL(route, `${location.protocol}//${location.host}`);
      url = url2.hash.substr(1);
    } catch (n) {
      url = "/";
      console.log(route);
    }
  const d = url.split("?"),
    [l, m] = [0 === url.length ? "/" : d[0], d[1]];
  return {
    route: _currentRoute(l),
    path: l
      .split("/")
      .filter(x => x)
      .slice(1),
    qs: new URLSearchParams(m)
  };
};
export const setQS = (k, v) => {
  const currentRoute = parseHash(window.location.href);
  const qs = currentRoute.qs;
  qs.set(k, v);
  const location = `${currentRoute.route}${currentRoute.path.join("/")}?${qs}`;
  loadHash(location);
};
