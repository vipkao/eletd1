export function BuildAtlasedTextBlitter(
    text: string,
    lap: number,
    atlasImageKey: string,
    scene: Phaser.Scene
){
    const charArray = text.toString().split("");
    const atlasTexture = scene.textures.get(atlasImageKey);
    const charFrames = charArray.map(n => {
        const ret = atlasTexture.get(n);
        return ret;
    });
    const ret = new Phaser.GameObjects.Blitter(scene, 0, 0, atlasImageKey);

    const drawFns:(() => void)[] = [];
    let x = 0;
    const BuildDrawFn = (x: number, key: string) => {
        return () => {ret.create(x, 0, key)};
    };
    charFrames.forEach((f, i) => {
        drawFns.push(BuildDrawFn(x, f.name));
        x += f.width - lap;
    });

    drawFns.reverse().forEach(fn => {
        fn();
    });

    return ret;
}