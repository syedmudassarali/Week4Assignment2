export class DiaryEntry{

    public constructor(public id: string, public testdate: string, public matchtype: string,public team: string,
        public player: string,public runs: Number,public balls: Number,public fours: Number,
        public sixes: Number,public strike: Number,public wickets: Number,public conceded: Number){}
}