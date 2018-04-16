// 获取cook
export function getCookieByKey(keyname){
    var str = document.cookie;
    var cookie_arr = str.split('; ');
    var value;
    // console.log(cookie_arr)
    cookie_arr.forEach((v,i)=>{
        var tep_arr = v.split('=');
        if(tep_arr[0]==keyname){
            value = tep_arr[1]
        }
    })
    return value
}

//设置cook
export function setCookie(keyname,value){
    document.cookie = keyname + '='+value
}
