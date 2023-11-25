import { json } from "@sveltejs/kit";
import * as mqtt from "mqtt";
import {MQTT_SERVER_ADDRESS, MQTT_SERVER_USERNAME, MQTT_SERVER_PASSWORD} from '$env/static/private'
export async function POST({ request }) {
    const { orderQty } = await request.json();
    const client = mqtt.connect(MQTT_SERVER_ADDRESS, {
        username: MQTT_SERVER_USERNAME || "",
        password: MQTT_SERVER_PASSWORD || "",
    });

    client.on("connect", () => {
        console.log("connected");
    });
    client.publishAsync(
        "crypto-candy-machine/txs",
        JSON.stringify({
            orderQty: String(orderQty),
        }), { qos: 2}
    );
    
    console.log(new Date().toUTCString(), "done");
    return json({ orderQty: orderQty, ordered: "true" }, { status: 200 });
}
