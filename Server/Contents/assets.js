import fs from "fs"; // 파일 읽기
import path from "path"; // 경로 읽기
import { fileURLToPath } from "url";

let gameAssets = {};

// import.meta.url ( 현재 파일의 절대 경로를 나타낸다. 현재 모듈의 경로 즉, assets.js의 위치 )
const __filename = fileURLToPath(import.meta.url);
// __filename의 이름을 제거하고 디렉토리 경로만 찾아낸다.
const __dirname = path.dirname(__filename);
// __dirname 위치에서 ../../ 위로 2번 올라간 후 assests의 위치를 찾아 basePath에 담는다.
// 즉 basePath에는 assets의 위치를 담고 있게 a된다.
const basePath = path.join(__dirname, '../../assets');

// 파일 읽기 ( 비동기 병렬로 파일을 읽는다. )
const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
            // 에러 발생하면 reject에 에러를 담아 반환하고 끝낸다.
            if (err) {
                reject(err);
                return;
            }

            // JSON.parse로 data를 JSON 형태로 읽어 반환한다.
            resolve(JSON.parse(data));
        })
    })
}

export const loadGameAssets = async () => {
    try {
        // stage.json, item.json, item_unlock.json을 비동기 병렬로 읽는다.
        // 비동기 병렬로 3파일을 읽지만, 모두 다 읽기 완료했을 경우에
        // 각각 stages, items, itemUnlocks에 저장할 수 있도록 Promise.all을 활용해준다.
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json')
        ]);

        gameAssets = { stages, items, itemUnlocks };

        return gameAssets;
    } catch (e) {
        throw new Error("Failed to load game assets" + e.message);
    }
}

export const getGameAssets = () => {
    return gameAssets;
}
