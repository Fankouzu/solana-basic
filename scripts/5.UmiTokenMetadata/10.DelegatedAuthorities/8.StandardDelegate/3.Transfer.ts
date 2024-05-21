import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { CLUSTER_URL, TokenMint, txExplorer } from "../../../lib/vars";
import {
  createSignerFromKeypair,
  generateSigner,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { UmiKeypair, umiPayer } from "../../../lib/umiHelper";
import {
  TokenStandard,
  mplTokenMetadata,
  transferV1,
} from "@metaplex-foundation/mpl-token-metadata";

(async () => {
  const umi = createUmi(CLUSTER_URL);
  const signer = createSignerFromKeypair(umi, umiPayer);
  umi.use(signerIdentity(signer, true));
  umi.use(mplTokenMetadata());

  // 读取保存的Delegate
  let delegateKeyPair = UmiKeypair("Delegate");
  console.log("Delegate address:", delegateKeyPair.publicKey);
  const delegate = createSignerFromKeypair(umi, delegateKeyPair);

  // 读取保存的Token地址
  let mint = publicKey(TokenMint("umi_non_fungible_token"));
  let receiver = generateSigner(umi);

  await transferV1(umi, {
    mint,
    authority: delegate,
    payer: signer,
    tokenOwner: signer.publicKey,
    destinationOwner: receiver.publicKey,
    tokenStandard: TokenStandard.NonFungible,
  })
    .sendAndConfirm(umi)
    .then(({ signature }) => {
      txExplorer(signature);
    });
})();
