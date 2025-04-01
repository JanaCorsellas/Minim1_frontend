export interface Comment {
    _id: string;
    author: string;
    activity: string;
    content: string;
    isEddited: boolean;
}

export class Comment implements Comment {
    constructor(
        public _id: string,
        public author: string,
        public activity: string,
        public content: string,
        public isEddited: boolean = false,
    ) {}
}