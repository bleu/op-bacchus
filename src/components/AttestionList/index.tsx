
"use client"
import { useState, useEffect } from "react";
import { useSigner } from "@/hooks/useSigner";
import { attestionsApi } from "../../../package/gql/src/eas/sdk";
import { parseData } from "./utils";

export function AttestionList() {
  const signer = useSigner();
  const [attestionData, setAttestionData] = useState(null);

  useEffect(() => {
    async function fetchAttestionData() {
      if (signer) {
        // Assuming AttestionList is an async function that returns some data
        const data = await attestionsApi.getAttestationsByAttester({ attester: signer.address });
        //@ts-ignore
        setAttestionData(data);
      }
    }

    fetchAttestionData();
  }, [signer]);

  if (!signer) {
    return <div>Account not found</div>;
  }

  if (!attestionData) {
    return <div>Loading attestation data...</div>;
  }

  return (
    <>
        <h2>Attestions</h2>
        <div>
            {/* @ts-ignore */}
            {attestionData.attestations.map((data: any) => (
                <AttestionItem key={data.id} data={data.decodedDataJson} />)
            )}
        </div>
    </>
  );
}

function AttestionItem({data}: {data: any}){
const parsedData = parseData(data)

return (
    <div>
        <div>{parsedData.name}</div>
        <div>{parsedData.briefDescription}</div>
        <div>{parsedData.startsAt}</div>
    </div>
)
}