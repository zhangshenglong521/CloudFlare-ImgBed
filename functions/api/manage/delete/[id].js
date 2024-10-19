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

    // await env.img_url.delete(params.id);
    const res = await deleteStudyJavaFile(params);

    return {metadata: res.data};

    const info = JSON.stringify(params.id);
    return new Response(info);

  }

async function deleteStudyJavaFile(params) {
    const options = {
        method: 'DELETE'
    };
    const res = await fetch('https://www.studyjava.cn/api/cloudflare/file/' + params.id, options)
    let responseData = await res.json();
    if (!responseData.flag) {
        throw new Error(`HTTP error! message: ${res}`);
    }
    return res;
}