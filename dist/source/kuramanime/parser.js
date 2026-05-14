"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animeVideoSource = exports.anime = exports.season = exports.seasonList = exports.genre = exports.genreList = exports.popular = exports.search = exports.recentRelease = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const BASEURL = "https://kuramanime.net";
const loadHtml = (data, errorMsg = "Page not found") => {
    if (!data || typeof data !== "string" || data.trim().length === 0) {
        throw new Error(errorMsg);
    }
    if (!cheerio || !cheerio.load) {
        throw new Error("Cheerio is not loaded properly");
    }
    return cheerio.load(data);
};
const recentRelease = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/anime/ongoing?order_by=latest&page=${page}`);
        const $ = loadHtml(base.data, "Page not found, you may request more than the maximum page");
        if (!$("#animeList .product__item").html()) {
            throw new Error("Page not found, you may request more than the maximum page");
        }
        let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
            .last()
            .html();
        $("#animeList .product__item").each((i, el) => {
            return list.push({
                slug: $(el).find("a").attr("href")?.split("/")[5],
                title: $(el).find(".product__item__text>h5>a").text(),
                episode: ~~$(el)
                    .find(".ep span")
                    .text()
                    .replace("Ep", "")
                    .split("/")[0]
                    .trim(),
                cover: $(el).attr("data-setbg"),
                url: $(el).find("a").attr("href"),
            });
        });
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.recentRelease = recentRelease;
const search = async (query, page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/anime?search=${query}&order_by=latest&page=${page}`);
        const $ = loadHtml(base.data, "Anime not found, or you may request more than the maximum page");
        if (!$("#animeList .product__item").html()) {
            throw new Error("Anime not found,or you may request more than the maximum page");
        }
        let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
            .last()
            .html();
        $("#animeList .product__item").each((i, el) => {
            list.push({
                slug: $(el).find("a").attr("href")?.split("/")[5],
                title: $(el).find(".product__item__text>h5>a").text(),
                cover: $(el).attr("data-setbg"),
                url: $(el).find("a").attr("href"),
            });
        });
        if (list.length == 0) {
            throw new Error("Anime not found");
        }
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.search = search;
const popular = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/anime/ongoing?order_by=popular&page=${page}`);
        const $ = loadHtml(base.data, "Page not found, you may request more than the maximum page");
        if (!$("#animeList .product__item").html()) {
            throw new Error("Page not found, you may request more than the maximum page");
        }
        let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
            .last()
            .html();
        $("#animeList .product__item").each((i, el) => {
            list.push({
                slug: $(el).find("a").attr("href")?.split("/")[5],
                title: $(el).find(".product__item__text>h5>a").text(),
                episode: ~~$(el)
                    .find(".ep span")
                    .text()
                    .replace("Ep", "")
                    .split("/")[0]
                    .trim(),
                cover: $(el).attr("data-setbg"),
                url: $(el).find("a").attr("href"),
            });
        });
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.popular = popular;
const genreList = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/properties/genre?genre_type=all&page=${page}`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$("#animeList .kuramanime__genres li").html()) {
            throw new Error("Page not found");
        }
        $("#animeList .kuramanime__genres li").each((i, el) => {
            list.push({
                slug: $(el).find("a").attr("href")?.split("/")[5]?.split("?")[0],
                title: $(el).find("a").text(),
                url: $(el).find("a").attr("href")?.trim(),
            });
        });
        return list;
    }
    catch (err) {
        throw err;
    }
};
exports.genreList = genreList;
const genre = async (genre, page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/properties/genre/${genre}?order_by=latest&page=${page}`);
        const $ = loadHtml(base.data, "Genre not found, or you may request more than the maximum page");
        if (!$("#animeList .product__item").html()) {
            throw new Error("Genre not found, or you may request more than the maximum page");
        }
        let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
            .last()
            .html();
        $("#animeList .product__item").each((i, el) => {
            list.push({
                slug: $(el).find("a").attr("href")?.split("/")[5],
                title: $(el).find(".product__item__text>h5>a").text(),
                cover: $(el).attr("data-setbg"),
                url: $(el).find("a").attr("href"),
            });
        });
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.genre = genre;
const seasonList = async (page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/properties/season?page=${page}`);
        const $ = loadHtml(base.data, "Page not found");
        if (!$("#animeList .kuramanime__genres li").html()) {
            throw new Error("Page not found");
        }
        $("#animeList .kuramanime__genres li").each((i, el) => {
            list.push({
                slug: $(el).find("a").attr("href")?.split("/")[5].split("?")[0],
                title: $(el).find("a").text(),
                url: $(el).find("a").attr("href")?.trim(),
            });
        });
        return list;
    }
    catch (err) {
        throw err;
    }
};
exports.seasonList = seasonList;
const season = async (season, page = 1) => {
    let list = [];
    try {
        const base = await axios_1.default.get(`${BASEURL}/properties/season/${season}?order_by=latest&page=${page}`);
        const $ = loadHtml(base.data, "Season not found, or you may request more than the maximum page");
        if (!$("#animeList .product__item").html()) {
            throw new Error("Season not found, or you may request more than the maximum page");
        }
        let maxPage = ~~$("#animeList .product__pagination a:not(:has(i))")
            .last()
            .html();
        $("#animeList .product__item").each((i, el) => {
            list.push({
                slug: $(el).find("a").attr("href")?.split("/")[5],
                title: $(el).find(".product__item__text>h5>a").text(),
                cover: $(el).attr("data-setbg"),
                url: $(el).find("a").attr("href"),
            });
        });
        return {
            page: ~~page,
            maxPage: maxPage,
            list: list,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.season = season;
const anime = async (slug) => {
    try {
        const base = await axios_1.default.get(`${BASEURL}/anime/${slug}`);
        const $ = loadHtml(base.data, "Anime not found");
        if (!$(".anime__details__widget ul").html()) {
            throw new Error("Anime not found");
        }
        let genre = [];
        $(".anime__details__widget ul")
            .find('span:contains("Genre:"),span:contains("Tema:")')
            .parent()
            .find("a")
            .each((i, el) => {
            genre.push($(el).text().replace(",", "").trim());
        });
        let episode = [];
        let $$ = loadHtml($("#episodeListsSection > #episodeLists").attr("data-content"), "Episode list not found");
        $$("a").each((i, el) => {
            episode.push($(el).text().trim());
        });
        return {
            slug: $('meta[property="og:url"]').attr("content")?.split("/")[5],
            title: $(".anime__details__title > h3").text(),
            titleAlt: $(".anime__details__title > span").text(),
            synopsis: $("#synopsisField").text(),
            episodeTotal: ~~$(".anime__details__widget ul")
                .find('span:contains("Total Eps:")')
                .next()
                .text(),
            episode: episode.length,
            season: $(".anime__details__widget ul")
                .find('span:contains("Musim:")')
                .next()
                .text(),
            genre: genre,
            cover: $(".set-bg").attr("data-setbg"),
            url: $('meta[property="og:url"]').attr("content"),
        };
    }
    catch (err) {
        throw err;
    }
};
exports.anime = anime;
const animeVideoSource = async (slug, ep) => {
    try {
        const url = await axios_1.default.head(`${BASEURL}/anime/${slug}`);
        const actualUrl = await url.request.res.responseUrl;
        const base = await axios_1.default.get(actualUrl + `/episode/${ep}?activate_stream=1`);
        const $ = loadHtml(base.data, "Episode not found");
        let videoSource = [];
        if (!$("#animeVideoPlayer video").html()) {
            throw new Error("Episode not found");
        }
        $("#animeVideoPlayer video")
            .find("source")
            .each((i, el) => {
            videoSource.push({
                quality: $(el).attr("size") + "p",
                url: $(el).attr("src"),
            });
        });
        return {
            episode: ~~ep,
            video: videoSource,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.animeVideoSource = animeVideoSource;
