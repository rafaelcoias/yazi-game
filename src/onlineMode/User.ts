export default class User {
  id: string;
  username: string;
  totalPoints: number;
  scores: { [key: string]: number };
  color: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.totalPoints = 0;
    this.scores = {};
    this.color = '';
    for (let i = 0; i <= 10; i++) {
      this.scores[i.toString()] = -1;
    }
  }

  updateScore(lineId: number, points: number): void {
    this.scores[lineId.toString()] = points;
    this.totalPoints += points;
  }
}
