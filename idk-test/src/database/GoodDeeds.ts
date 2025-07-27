interface Deeds {
    id: number;
    rate: number;
    list: Deed[];
}

interface Deed {
    title: string;
    desc: string;
    time: number;
}

export { Deeds, Deed }