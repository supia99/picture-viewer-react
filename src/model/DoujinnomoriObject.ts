export type DoujinnmoriObject = {
    id: number,
    uuid: string,
    product_id: number,
    name: string,
    seo_name: string,
    kana: string,
    page: number,
    open_datetime: string,
    created: string,
    modified: string,
    product: {
        id: number,
        name: string,
        kana: string,
        created: string,
        modified: string,            
    },
    thumbnailUrl: string,
}