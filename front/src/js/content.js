/**
 * content.js
 * Entry point.
 */

console.log("fraud_alert is running ... ");

const result = getCreator();

switch ( result.status ) {
    case -1:
        /* error */
        console.log("[error]" + result.error_message);
        break;
    case 501:
        /* ASINがあるページではないため終了 */
        console.log("[success] This page has not ASIN.");
        break;
    case 0:
        /* 該当者なし */
        display_form( result.asin );
        break;
    case 1:
        /* 該当者あり */
        display_content( result.creator );
        break;

    default:
        console.log("原因不明のエラーが発生しました. 開発者に問い合わせください.");
        break;
}

console.log("fraud_alert was finished");