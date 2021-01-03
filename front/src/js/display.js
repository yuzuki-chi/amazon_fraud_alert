/**
 * display.js
 * 表示を行うための関数
 */

function display_content(creator) {
    // console.log(creator);
    const creator_asin = creator[0].asin;
    const creator_link = creator[0].link;
    const creator_name = creator[0].name;

    //dpはAmazonにおけるメインコンテンツ部分. 今回はその上に挿入する.
    var dp = document.getElementById('dp');

    var wrapper = document.createElement('div');
    wrapper.id = "fraud_alert_contnt"
    wrapper.style.textAlign = "center";
    wrapper.style.padding = "10px";
    wrapper.style.backgroundColor = '#EDF7FF';

    var alert_title = document.createElement('div');
    alert_title.textContent = "⚠️イラスト転用が報告されている商品です⚠️";
    alert_title.style.fontSize = "20px";

    var creator_wrapper = document.createElement('div');

    var creator_info = document.createElement('a');

    creator_info.href = creator_link;
    creator_info.innerText = creator_name;

    creator_wrapper.style.paddingTop = "14px";
    creator_wrapper.style.fontSize = "20px";
    creator_wrapper.textContent = "著作者：";
    creator_wrapper.appendChild(creator_info);

    var report_wrapper = document.createElement('div');
    report_wrapper.style.textAlign = "right";
    report_wrapper.style.paddingRight = "30px";
    var report = document.createElement('a');
    report.innerText = "情報の報告";
    report.href = "https://fraudalert.citron-tree.jp/edit/?asin=" + creator_asin;
    report.target = "_blank";
    report_wrapper.appendChild(report);

    wrapper.appendChild(alert_title);
    wrapper.appendChild(creator_wrapper);
    wrapper.appendChild(report_wrapper);

    dp.before(wrapper);
}

function display_form(asin) {
    //サーバに該当するASINがないが、報告したい時
    //dpはAmazonにおけるメインコンテンツ部分. 今回はその上に挿入する.
    const creator_asin = asin;
    console.log("asin is " + asin);

    var dp = document.getElementById('dp');

    var wrapper = document.createElement('div');
    wrapper.id = "fraud_alert_contnt"
    wrapper.style.textAlign = "center";
    wrapper.style.padding = "10px";
    wrapper.style.backgroundColor = '#EDF7FF';

    var form_title = document.createElement('a');
    form_title.textContent = "イラストの無断転用として報告する";
    form_title.style.fontSize = "20px";
    form_title.href = "https://fraudalert.citron-tree.jp/report/?asin=" + creator_asin;
    form_title.target = "_blank";
    wrapper.appendChild(form_title);

    dp.before(wrapper);
}