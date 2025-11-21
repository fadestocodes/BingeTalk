export const badges = {
    conversationalistBronze: require('../assets/images/badges/conversationalist_bronze.png'),
    conversationalistSilver: require('../assets/images/badges/conversationalist_silver.png'),
    conversationalistGold: require('../assets/images/badges/conversationalist_gold.png'),
    criticBronze: require('../assets/images/badges/critic_bronze.png'),
    criticSilver: require('../assets/images/badges/critic_silver.png'),
    criticGold: require('../assets/images/badges/critic_gold.png'),
    tastemakerBronze: require('../assets/images/badges/tastemaker_bronze.png'),
    tastemakerSilver: require('../assets/images/badges/tastemaker_silver.png'),
    tastemakerGold: require('../assets/images/badges/tastemaker_gold.png'),
    auteurBronze: require('../assets/images/badges/auteur_bronze.png'),
    auteurSilver: require('../assets/images/badges/auteur_silver.png'),
    auteurGold: require('../assets/images/badges/auteur_gold.png'),
    curatorBronze: require('../assets/images/badges/curator_bronze.png'),
    curatorSilver: require('../assets/images/badges/curator_silver.png'),
    curatorGold: require('../assets/images/badges/curator_gold.png'),
    historianBronze: require('../assets/images/badges/historian_bronze.png'),
    historianSilver: require('../assets/images/badges/historian_silver.png'),
    historianGold: require('../assets/images/badges/historian_gold.png'),
    peoplesChoiceBronze: require('../assets/images/badges/peopleschoice_bronze.png'),
    peoplesChoiceSilver: require('../assets/images/badges/peopleschoice_silver.png'),
    peoplesChoiceGold: require('../assets/images/badges/peopleschoice_gold.png'),
  };

  
  export const badgeIconMap = [
    {
      type: "CRITIC",
      description: "",
      levels: {
        BRONZE: { uri: badges.criticBronze },
        SILVER: { uri: badges.criticSilver },
        GOLD: { uri: badges.criticGold }
      }
    },
    {
      type: "AUTEUR",
      description: "",
      levels: {
        BRONZE: { uri: badges.auteurBronze },
        SILVER: { uri: badges.auteurSilver },
        GOLD: { uri: badges.auteurGold }
      }
    },
    {
      type: "TASTEMAKER",
      description: "",
      levels: {
        BRONZE: { uri: badges.tastemakerBronze },
        SILVER: { uri: badges.tastemakerSilver },
        GOLD: { uri: badges.tastemakerGold }
      }
    },
    {
      type: "CURATOR",
      description: "",
      levels: {
        BRONZE: { uri: badges.curatorBronze },
        SILVER: { uri: badges.curatorSilver },
        GOLD: { uri: badges.curatorGold }
      }
    },
    {
      type: "HISTORIAN",
      description: "",
      levels: {
        BRONZE: { uri: badges.historianBronze },
        SILVER: { uri: badges.historianSilver },
        GOLD: { uri: badges.historianGold }
      }
    },
    {
      type: "CONVERSATIONALIST",
      description: "",
      levels: {
        BRONZE: { uri: badges.conversationalistBronze },
        SILVER: { uri: badges.conversationalistSilver },
        GOLD: { uri: badges.conversationalistGold }
      }
    },
    {
      type: "PEOPLES_CHOICE",
      description: "",
      levels: {
        BRONZE: { uri: badges.peoplesChoiceBronze },
        SILVER: { uri: badges.peoplesChoiceSilver },
        GOLD: { uri: badges.peoplesChoiceGold }
      }
    },
  ];
  