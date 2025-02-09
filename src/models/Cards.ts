export type Cards = Card[]

export type Card = {
    id: number;
    name: string;
    co2: number;
    img: string;
    hidden: boolean;
    description: string;
    sectionId: SectionIdType;
}

export enum SectionIdType {
    TOP = "top",
    BOTTOM = "bottom",
}