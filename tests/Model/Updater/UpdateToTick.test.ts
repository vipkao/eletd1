import { Preset as MillisecondServer_Preset } from "#/Model/Updater/MillisecondServer/Preset";
import { Delta } from "#/Model/Updater/TickDetector/Delta";
import { Preset as DeltaServer_Preset } from "#/Model/Updater/TickDetector/DeltaServer/Preset";
import { LastStock } from "#/Model/Updater/TickWorker/LastStock";
import { UpdateToTick } from "#/Model/Updater/UpdateToTick";

test("", () => {
    const lastTick = new LastStock();
    const deltaServer = new DeltaServer_Preset();
    const timeServer = new MillisecondServer_Preset();

    const target = new UpdateToTick(
        timeServer,
        new Delta(
            deltaServer
        ),
        lastTick
    );

    timeServer.millisecond = 0;
    deltaServer.delta = 1;

    expect(lastTick.lastTick).toBe(-1);

});
