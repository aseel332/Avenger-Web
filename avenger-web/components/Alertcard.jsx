import { getFirstThreeHeadlines } from "../utils/headlines";

export default function Alertcard(){
  return(
    <>
      <header>Alert!</header>
      {getFirstThreeHeadlines().map((headline, headlineIndex) => {
        return(
          <p className="headline-div" key={headlineIndex}>{headline}</p>
        )
      })}
    </>
  )
}