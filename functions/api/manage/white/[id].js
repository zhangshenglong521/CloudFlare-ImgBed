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
    // value.metadata.ListType = "White"
    // await env.img_url.put(params.id,"",{metadata: value.metadata});

    const value = await getStudyJavaFile(params.id);
    value.metadata.ListType = "White"
    await updateStudyjavaFile(value);

    const info = JSON.stringify(value.metadata);
    return new Response(info);

  }

async function getStudyJavaFile(id) {
    const res = await fetch('https://www.studyjava.cn/api/cloudflare/file/'+id)
    let responseData = await res.json();
    if (!responseData.flag) {
        throw new Error(`HTTP error! message: ${res}`);
    }

    return {metadata: responseData.data};
}

async function updateStudyjavaFile(value) {
    let data = value.metadata;
    const jsonData = JSON.stringify(data);
    // 设置请求的选项
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': jsonData.length.toString()
        },
        body: jsonData
    };
    const res = await fetch('https://www.studyjava.cn/api/cloudflare/file/' + data.FileId, options)
    let responseData = await res.json();
    if (!responseData.flag) {
        throw new Error(`HTTP error! message: ${res}`);
    }
}