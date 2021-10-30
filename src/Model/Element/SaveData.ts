
/**
 * 持ち回るデータ。
 */
export class SaveData{
    /**
     * 登録者数。
     */
    public subscribers: number = 0;

    public toString(): string{
        return `sub:${this.subscribers}`;
    }
}