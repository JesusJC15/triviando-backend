import { Types } from 'mongoose';
import { Room } from '../src/models/room.model';

describe('Room model helper methods', () => {
  it('isFull returns true when players length >= maxPlayers', () => {
    const hostId = new Types.ObjectId();
    const player1 = { userId: new Types.ObjectId(), name: 'A', joinedAt: new Date() } as any;
    const player2 = { userId: new Types.ObjectId(), name: 'B', joinedAt: new Date() } as any;

    const room = new Room({ code: 'ABC123', hostId, triviaId: new Types.ObjectId(), maxPlayers: 2, players: [player1, player2] } as any);

    expect(room.isFull()).toBe(true);
  });

  it('isFull returns false when players length < maxPlayers', () => {
    const hostId = new Types.ObjectId();
    const player1 = { userId: new Types.ObjectId(), name: 'A', joinedAt: new Date() } as any;

    const room = new Room({ code: 'ABC124', hostId, triviaId: new Types.ObjectId(), maxPlayers: 3, players: [player1] } as any);

    expect(room.isFull()).toBe(false);
  });

  it('hasPlayer returns true for existing player and false otherwise', () => {
    const hostId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const otherId = new Types.ObjectId();

    const player = { userId, name: 'Player', joinedAt: new Date() } as any;
    const room = new Room({ code: 'ABC125', hostId, triviaId: new Types.ObjectId(), maxPlayers: 4, players: [player] } as any);

    expect(room.hasPlayer(userId)).toBe(true);
    expect(room.hasPlayer(otherId)).toBe(false);
  });
});
