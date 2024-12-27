import React, { useState } from "react";
import MarketCard from "../markets/MarketCard";

const Markets = (props) => {
  let [filteredMarkets, setFilteredMarkets] = useState([]);
  let [allMarkets, showAllMarkets] = useState(true);

  const filterByBorough = (borough) => {
    setFilteredMarkets(
      props.markets.filter((market) => market.borough === borough),
    );
  };

  const handleOnChange = (e) => {
    let borough = e.target.value;
    filterByBorough(borough);
    showAllMarkets(false);
  };
  return (
    <div>
      <div>
        <label
          htmlFor="borough"
          class="block text-sm/6 font-medium text-gray-900"
        >
          Filter by Borough
        </label>
        <select
          id="borough"
          onChange={handleOnChange}
          defaultValue={"default"}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="default" disabled>
            Filter by Borough
          </option>
          <option value="Brooklyn">Brooklyn</option>
          <option value="Queens">Queens</option>
          <option value="Manhattan">Manhattan</option>
          <option value="Bronx">Bronx</option>
          <option value="Staten Island">Staten Island</option>
        </select>
      </div>

      {allMarkets
        ? props.markets.map((market) => (
            <div key={market.id}>
              <MarketCard market={market} userMarkets={props.userMarkets} />
              <hr />
            </div>
          ))
        : filteredMarkets.map((market) => (
            <div key={market.id}>
              <MarketCard market={market} userMarkets={props.userMarkets} />
              <hr />
            </div>
          ))}
    </div>
  );
};

export default Markets;
