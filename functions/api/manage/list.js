export async function onRequest(context) {
    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    let allRecords = [];
    let cursor = null;

    do {
        // let records = await env.img_url.list({
        //   limit: 1000,
        //   cursor,
        // });
        // allRecords.push(...records.keys);
        //
        // // 保存Java
        // for (const key of allRecords) {
        //     const imgRecord = await env.img_url.getWithMetadata(key)
        //
        //     if(imgRecord.metadata){
        //         imgRecord.metadata.FileId = key
        //         await saveFile(imgRecord.metadata);
        //     }
        //
        // }
        let records = {
            limit: 1000,
            cursor,
        };

        await getStudyJavaFiles(records);
        allRecords.push(...records.keys);

        cursor = records.cursor;
    } while (cursor);

    const info = JSON.stringify(allRecords);
    return new Response(info);

}

async function getStudyJavaFiles() {
    const res = await fetch('https://www.studyjava.cn/api/cloudflare/files?cursor='+records.cursor+'&limit='+records.limit)
    let responseData = res.json();
    if (!responseData.flag) {
        throw new Error(`HTTP error! message: ${res}`);
    }

    records.keys = [];
    responseData.data.records.forEach(it => {
        records.keys.push(it.FileId);
    })
}

async function saveFile(data) {
    // 将数据转换为JSON字符串
    const jsonData = JSON.stringify(data);

    // 设置请求的选项
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': jsonData.length.toString()
        },
        body: jsonData
    };
    const res = await fetch('https://www.studyjava.cn/api/cloudflare/file/save', options)
    let responseData = res.json();
    if (!responseData.flag) {
        throw new Error(`HTTP error! message: ${res}`);
    }
}