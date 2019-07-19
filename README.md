# Examples for Samchon Framework
> ## Deprecated, use TGrid instead
> [**TGrid**](https://github.com/samchon/tgrid) - TypeScript Grid Computing Framework 
> 
> I've developed much better solution for implementing the [OON](https://github.com/samchon/framework#object-oriented-network) by realizing the true Grid Computing through the RFC (Remote Function Call). [**TGrid**](https://github.com/samchon/tgrid) is a new framework for that solution. Therefore, [**TGrid**](https://github.com/samchon/tgrid) will replace the Samchon Frameowrk and continue developing the *OON*.

## TGrid-Exampels
*Samchon Framework* has been deprecated and [TGrid](https://github.com/samchon/tgrid) will replace it. Also, this example repository would be deprecated and replaced to the [tgrid-examples](https://github.com/samchon/tgrid-examples).

#### [`composite-calculator/server.ts`](https://github.com/samchon/tgrid.examples/blob/master/src/projects/composite-calculator/server.ts)
```typescript
import { WebServer, WebAcceptor } from "tgrid/protocols/web";
import { CompositeCalculator } from "../../providers/Calculator";

async function main(): Promise<void>
{
    let server: WebServer = new WebServer();
    await server.open(10102, async (acceptor: WebAcceptor) =>
    {
        await acceptor.accept(new CompositeCalculator());
    });
}
main();
```

#### [`composite-calculator/client.ts`](https://github.com/samchon/tgrid.examples/blob/master/src/projects/composite-calculator/client.ts)
```typescript
import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";

import { ICalculator } from "../../controllers/ICalculator";

async function main(): Promise<void>
{
    //----
    // CONNECTION
    //----
    let connector: WebConnector = new WebConnector();
    await connector.connect("ws://127.0.0.1:10102");

    //----
    // CALL REMOTE FUNCTIONS
    //----
    // GET DRIVER
    let calc: Driver<ICalculator= connector.getDriver<ICalculator>();

    // FUNCTIONS IN THE ROOT SCOPE
    console.log("1 + 6 =", await calc.plus(1, 6));
    console.log("7 * 2 =", await calc.multiplies(7, 2));

    // FUNCTIONS IN AN OBJECT (SCIENTIFIC)
    console.log("3 ^ 4 =", await calc.scientific.pow(3, 4));
    console.log("log (2, 32) =", await calc.scientific.log(2, 32));

    try
    {
        // TO CATCH EXCEPTION IS STILL POSSIBLE
        await calc.scientific.sqrt(-4);
    }
    catch (err)
    {
        console.log("SQRT (-4) -Error:", err.message);
    }

    // FUNCTIONS IN AN OBJECT (STATISTICS)
    console.log("Mean (1, 2, 3, 4) =", await calc.statistics.mean(1, 2, 3, 4));
    console.log("Stdev. (1, 2, 3, 4) =", await calc.statistics.stdev(1, 2, 3, 4));

    //----
    // TERMINATE
    //----
    await connector.close();
}
main();
```
>
>```
>1 + 6 = 7
>7 * 2 = 14
>3 ^ 4 = 81
>log (2, 32) = 5
>SQRT (-4) -Error: Negative value on sqaure.
>Mean (1, 2, 3, 4) = 2.5
>Stdev. (1, 2, 3, 4) = 1.118033988749895
>``` 