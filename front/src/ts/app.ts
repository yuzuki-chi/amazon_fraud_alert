console.log("fraud_alert is running ... ");

// 1. Amazon.co.jpからASINを取得
function loadAsin(): string { 
    return "asin_id";
}
const asin = loadAsin();

// 2. ASINを citron-tree.jp/api にGET送信する（非同期）
const url = "https://fraudalert.citron-tree.jp/api/?asin=" + asin;
fetch( url, {
    method: "GET"
}).then(function (response) { return response.text(); })
    .then(function (text) {
    console.log(text);
    const res = JSON.parse(text);
    console.log(res);
});

/**
 * status:      -1   err
 *              200  successed
 * product:[
 *  name:   product_name
 *  asin:   ASIN
 * ]
 * creator:[
 *  name:   creator name
 *  contact_url:    contact URL (e.g. Twitter)
 *  email:  contact email
 * ]
 */

// 3. 帰ってきたJSONを Creator と Productインスタンスにする
const product = Product(res.product.name, res.product.asin);
const creator = Creator(res.product.name, res.product.contact_url, res.product.email);

// 4. 最終的に結果を表示 (該当すればCreatorの表示, しなければ登録確認)
function showInfo(product, creator) {
    console.log(product);
    console.log(creator);
}
