import axios from 'axios'
import  htmlparser from 'htmlparser'
import util from 'util'



export function getSearchResult(commonParams) {
    // 定义的搜索地址
    const url = "https://m.rosegal.com/index.php"

    // 传递的参数
    const data = Object.assign({}, commonParams)
    
    // 返回一个promise
    return axios.get(url, {
        params: data
    }).then((res) => {
        // 拿到数据以后进行处理，拿到处理好的数据
        return excapeTheResult(res.data)   
    })
}

// 本函数是去除jsonp的外壳，同时传值给ExtractData进行数据清洗。
async function excapeTheResult (data) {
    if(data.indexOf('fail') !== -1) {
        return false;
    }
    // 拿到第一个尖括号的位置
    let firstBracketsIndex = data.indexOf('<')

    // 拿到最后一个尖括号的位置
    let lastBracketsIndex = data.lastIndexOf('>')

    // 拿到基本DOM数据，进行进一步数据提取
    let basicResult = data.substring(firstBracketsIndex, lastBracketsIndex+1).replace(/\\/g, "")
    
    // console.log(basicResult) 
    let outputResult = await ExtractData(basicResult)

    return outputResult
}

// 将传入的data注入到DOM元素中，并且进行解析后拼装最后的结果
function ExtractData (data) {
    let rawHtml = data  
    let handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error)
        else
            console.log('Dom parse done!! XD')
    });
    let parser = new htmlparser.Parser(handler)
    parser.parseComplete(rawHtml)
    
    // outputResult[0].children 这里拿到的是全部的li元素，接下来就可以遍历循环拿到真实的数据了
    // console.log(util.inspect(handler.dom, false, null));


    let parseResult = handler.dom[0].children
    let resultSet = [];

    // 组装出最后的数据
    for(let i = 0; i < parseResult.length; i++){
        // console.log(parseResult[i].children[0].children[0].children[0].children[0].data + parseResult[i].children[0].children[0].children[1].data)
        let item = {}, product_name = parseResult[i].children[0].children[0].children[0].children[0].data + parseResult[i].children[0].children[0].children[1].data
        item['product_name'] = product_name
        item['url'] = "https://m.rosegal.com/" + product_name.toLowerCase().replace(/\s+/g,'-') + "/shop/"
        resultSet.push(item)
    }
    console.log(resultSet)
    return resultSet
}

