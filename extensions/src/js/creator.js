/**
 * creator.js
 * クリエイター情報を取得するための関数
 */

 /**
  * getCreator
  * @returns     -1 : エラー (error_messageを確認)
  *               0 : ASINを検索したところ, 該当者がヒットしなかった. (asinを返す)
  *               1 : ASINを検索したところ, 該当者がヒットした. (creator情報を返す) 
  *             501 : ASINが無いページです.
  */
function getCreator() {
    //少し頭の悪い方法で, ASIN番号を取得する.
    var first = document.getElementById('detailBullets_feature_div');
    if ( first == null ) return { status:501 }
    var second = first.getElementsByTagName( 'ul' );
    var thurd = second[0].textContent;
    var split = thurd.split( ":" );

    //ASIN番号が含まれているのは何番目からを調べる
    for( var i=0; i<split.length; i++ ) {
        var str = split[i];
        if ( str.indexOf('ASIN') !== -1 ) {
            var asin_num = i+1;
            break;
        }
    }

    if( asin_num==-1 ) return { status:-1, "error_message":"ASINの取得に失敗しました" }; //ASINが取得できなかったとき

    var tmp = split[asin_num].replace(/\n/g, ' ');
    var asin = tmp.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789]/g, '')
    

    //TODO: XMLHttpRequestは非推奨手法のため, 別の手法に変更する.

    var request = new XMLHttpRequest();
    request.open( 'GET', 'https://fraudalert.citron-tree.jp/api/?asin='+asin, false );
    // request.responseType = 'json';
    
    request.send();
       
    if ( request.status === 200 ) {
        const result = JSON.parse( request.responseText );

        if( result.status === -1 ) {
            console.log( "著作者検索の際にサーバ側でエラーが発生しました" );
            return {status:-1, "error_message":"著作者検索の際にサーバ側でエラーが発生しました"};
        } else {
            if( result["hit"] == 0 ) { 
                console.log( "該当者がヒットしませんでした" );
                return {status:0, "asin":asin};
            } else { 
                console.log( "該当者がヒットしました" );
                return {status:1, "creator":result.creator};
            }
        }
    }
    //-----

}