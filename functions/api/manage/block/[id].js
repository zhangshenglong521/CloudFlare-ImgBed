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
    // 解码params.id
    params.id = decodeURIComponent(params.id);

    //read the metadata
    // const value = await env.img_url.getWithMetadata(params.id);
    //
    // //change the metadata
    // value.metadata.ListType = "Block"
    // await env.img_url.put(params.id,"",{metadata: value.metadata});
    await updateStudyjavaFile(params.id);


    const info = JSON.stringify(value.metadata);
    return new Response(info);

}

async function updateStudyjavaFile(fileId) {
    const reqData = {FileId: fileId, ListType: "Block"}
    const jsonData = JSON.stringify(reqData);
    // 设置请求的选项
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': jsonData.length.toString()
        },
        body: jsonData
    };
    const res = await fetch('https://www.studyjava.cn/api/cloudflare/file/' + fileId, options)
    let responseData = res.json();
    if (!responseData.flag) {
        throw new Error(`HTTP error! message: ${res}`);
    }
}