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
    // let allRecords = [];
    // let cursor = 0;
    //
    // do {
    //     // let records = await env.img_url.list({
    //     //   limit: 1000,
    //     //   cursor,
    //     // });
    //     // allRecords.push(...records.keys);
    //     //
    //     // // 保存Java
    //     // for (const key of allRecords) {
    //     //     const imgRecord = await env.img_url.getWithMetadata(key)
    //     //
    //     //     if(imgRecord.metadata){
    //     //         imgRecord.metadata.FileId = key
    //     //         await saveFile(imgRecord.metadata);
    //     //     }
    //     //
    //     // }
    //     let records = {
    //         limit: 1000,
    //         cursor,
    //     };
    //
    //     await getStudyJavaFiles(records);
    //     allRecords.push(...records.keys);
    //
    //     cursor = records.cursor;
    // } while (cursor);
    const url = new URL(request.url);
    const page = url.searchParams.get("page")
    const pageSize = url.searchParams.get("pageSize")
    const keywords = url.searchParams.get("keywords")
    let param = {
        page: page,
        size: pageSize,
        keywords: keywords,
    };
    const responseData = await getStudyJavaFiles(param);

    let datas = []
    responseData.records.forEach(it => {
        datas.push({metadata: it, name: it.FileId});
    })
    const info = JSON.stringify({total: responseData.total, data: datas});
    return new Response(info);

}

async function getStudyJavaFiles(params) {
    let url = "https://www.studyjava.cn/api/cloudflare/files";
    //拼接参数
    let paramsArray = [];
    Object.keys(params).forEach(key => {
        if (params[key]){
            paramsArray.push(key + '=' + params[key])
        }
    })
    if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&')
    } else {
        url += '&' + paramsArray.join('&')
    }
    const res = await fetch(url)
    let responseData = await res.json();
    if (!responseData.flag) {
        throw new Error(`HTTP error! message: ${JSON.stringify(res)}`);
    }

    // records.keys = [];
    // responseData.data.records.forEach(it => {
    //     records.keys.push({metadata: it, name: it.FileId});
    // })
    // records.cursor = responseData.data.cursor;
    return responseData.data;
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
    let responseData = await res.json();
    if (!responseData.flag) {
        throw new Error(`HTTP error! message: ${res}`);
    }
}