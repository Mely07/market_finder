# frozen_string_literal: true

class MarketRefreshJob
  include Sidekiq::Worker
  sidekiq_options queue: :default, retry: false

  def perform
    markets = fetched_markets_from_api

    markets.each do |market_data|
      market = Market.find_or_initialize_by(
        latitude: market_data['latitude'],
        longitude: market_data['longitude'],
        name: market_data['marketname']
      )

      if market.new_record?
        market.assign_attributes(
          name: market_data['marketname'],
          borough: market_data['borough'],
          street_address: market_data['streetaddress'],
          district: market_data['community_district'],
          latitude: market_data['latitude'],
          longitude: market_data['longitude'],
          days_of_operation: market_data['daysoperation'],
          hours: market_data['hoursoperation'],
          season_dates: market_data['seasondates'],
          ebt_accepted: market_data['accepts_ebt']
        )

        unless market.save
          Rails.logger.error("Error saving market #{market.name}: #{market.errors.full_messages.join(', ')}")
        end
      end
    end

    Rails.cache.delete(:cached_markets)
  end

  private

  def fetched_markets_from_api
    response = RestClient.get('https://data.cityofnewyork.us/resource/8vwk-6iz2.json')
    if response.code == 200
      JSON.parse(response.body)
    else
      Rails.logger.error('Failed to fetch markets data from API')
      []
    end
  end
end
