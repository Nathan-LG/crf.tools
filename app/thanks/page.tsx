import Image from "next/image";

const Thanks = () => {
  const gif = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3JkcGFqY3I3M3duMDQxYm9zYXpkYXJjb2Z3NW5yajV4YXk5MXFocCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26gsjCZpPolPr3sBy/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3JkcGFqY3I3M3duMDQxYm9zYXpkYXJjb2Z3NW5yajV4YXk5MXFocCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/i21tixUQEE7TEqwmYa/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3JkcGFqY3I3M3duMDQxYm9zYXpkYXJjb2Z3NW5yajV4YXk5MXFocCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/R6gvnAxj2ISzJdbA63/giphy.gif",
    "https://media.giphy.com/media/uWlpPGquhGZNFzY90z/giphy.gif?cid=790b7611wrdpajcr73wn041bosazdarcofw5nrj5xay91qhp&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/fVtcfEXWQJQUbsF1sH/giphy.gif?cid=790b7611wrdpajcr73wn041bosazdarcofw5nrj5xay91qhp&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/7rwS6e59S26Ozzud2o/giphy.gif?cid=790b7611wrdpajcr73wn041bosazdarcofw5nrj5xay91qhp&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/BYoRqTmcgzHcL9TCy1/giphy.gif?cid=ecf05e47xl0a4rv3qgipm1rxyys9hbhancbcf06lkj59c42b&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/9wzyL40ZkugdAy24aP/giphy.gif?cid=ecf05e47xl0a4rv3qgipm1rxyys9hbhancbcf06lkj59c42b&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/hxERQNWQudqSF1iDnr/giphy.gif?cid=ecf05e47xl0a4rv3qgipm1rxyys9hbhancbcf06lkj59c42b&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/l3q2wJsC23ikJg9xe/giphy.gif?cid=ecf05e47437pgwejm84253l4x3eh403wz4kfbv4slww8uptl&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3N3aXpvZHVwb2Vpcm96ODNlNDdqMnljMzF6a2Fmc25wZmZnYXFwdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kL4fn0ecmGFqbyAqHi/giphy.gif",
    "https://media.giphy.com/media/M9NbzZjAcxq9jS9LZJ/giphy.gif?cid=ecf05e47ss1sgppk2joajst0waf5dnqmi73npgg5ct1m16kq&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/4YY5Yh1qSeCMwQbrnf/giphy.gif?cid=ecf05e47ss1sgppk2joajst0waf5dnqmi73npgg5ct1m16kq&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif?cid=ecf05e47adbnbugikkcn2zp8op1h90vecpsmetyegkackt0o&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  ];

  const max = Math.floor(gif.length - 1);
  const randomNumber = Math.floor(Math.random() * (max + 1));

  return (
    <div className="page page-center">
      <div className="container container-slim py-4">
        <div className="text-center">
          <div className="mb-3"></div>
          <div className="text-secondary mb-3">Toute la log te dit...</div>
          <Image
            src={gif[randomNumber]}
            alt="Merci"
            className="img-fluid mb-3"
          />
        </div>
      </div>
    </div>
  );
};
export default Thanks;
