function AmazonAssociate(marketPlace, tag) {
  this.tag = tag;
  this.linkCode = "as2";    
  switch (marketPlace) {
    case "com":
        marketPlace = 'US';
        break;
    case "ca":
        marketPlace = 'CA';
        break;
    case "co.uk":
        marketPlace = 'GB';
        break;
    case "de":
        marketPlace = 'DE';
        break;
    case "fr":
        marketPlace = 'FR';
        break;
    case "JP":
        marketPlace = 'JP';
        break;
    default:
        marketPlace = marketPlace;
  }  
  this.marketPlace = marketPlace;
}

AmazonAssociate.prototype.getTag = function getTag() {
  switch (this.marketPlace) {
    case "US":
        return this.tag + '-20';
    case "DE":
        return this.tag + '-21';
    case "CA":
        return this.tag + '';
    case "GB":
        return this.tag + '';
    case "FR":
        return this.tag + '';
    case "JP":
        return this.tag + '';
    }
}

AmazonAssociate.prototype.getAmazonLink = function getAmazonLink() {
  switch (this.marketPlace) {
    case "US":
        return "http://www.amazon.com/";
    case "CA":
        return "http://www.amazon.ca/";
    case "GB":
        return "http://www.amazon.co.uk/";
    case "DE":
        return "http://www.amazon.de/";
    case "FR":
        return "http://www.amazon.fr/";
    case "JP":
        return "http://www.amazon.jp/";
    }
}

AmazonAssociate.prototype.getCreativeId = function getCreativeId() {
  switch (this.marketPlace) {
    case "US":
        return "380601";
    case "CA":
        return "381193";
    case "GB":
        return "8946";
    case "DE":
        return "9066";
    case "FR":
        return "9186";
    case "JP":
        return "3887";
    }
}

AmazonAssociate.prototype.getCampaignId = function getCampaignId() {
    switch (this.marketPlace) {
      case "US":
          return "212361";
      case "CA":
          return "212529";
      case "GB":
          return "2486";
      case "DE":
          return "2474";
      case "FR":
          return "2498";
      case "JP":
         return "759";
  }
}

AmazonAssociate.prototype.getSingleDetailPageUrl = function getSingleDetailPageUr(asin) {
  return this.getAmazonLink() + "gp/product/" + asin + "?ie=UTF8" + "&tag=" + this.getTag() + "&link_code=" + this.linkCode + "&camp=" + this.getCampaignId() + "&creative=" + this.getCreativeId() + "&creativeASIN=" + asin;
}

AmazonAssociate.prototype.getSearchPageUrl = function getSearchPageUrl(searchTerms) {
  return this.getAmazonLink() + "gp/redirect.html?ie=UTF8&location=" + encodeURIComponent(this.getAmazonLink() + "s?ie=UTF8&x=10&ref_=nb_sb_noss&y=15&field-keywords=" + encodeURIComponent(searchTerms) + "&url=") + "search-alias%253Daps&tag=" + this.getTag() + "&linkCode=" + this.linkCode + "&camp=" + this.getCampaignId() + "&creative=" + this.getCreativeId();  
}