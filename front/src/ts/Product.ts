class Product {
    private _asin: string = '';
    private name: string;

    constructor(asin: string) {
        this._asin = asin;
    }

    set asin(asin: string) {
        this._asin = asin;
    }
    get asin(): string {
        console.log(this.asin);
        return this._asin;
    }

    private search(): boolean {
        return true;
    }
}