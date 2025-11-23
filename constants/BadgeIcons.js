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
      description: "Sharpen your voice and share your perspective with the world. The Critic badge celebrates users who thoughtfully review what they watch, helping others discover what’s worth their time. Whether you’re blunt, poetic, or analytical, your words help shape the conversation.",
      levels: {
        BRONZE: { 
          uri: badges.criticBronze,
          levelDescription : "You’ve started finding your voice! Earned for posting 10 reviews of at least 50 characters."
         },
        SILVER: { 
          uri: badges.criticSilver,
          levelDescription:"Your reviews are getting richer and deeper. Awarded for 30 thoughtful reviews with at least 200 characters each."
        },
        GOLD: { 
          uri: badges.criticGold,
          levelDescription:"A true critic emerges. Granted for 50 in-depth reviews of 500+ characters each."
        }
      }
    },
    {
      type: "AUTEUR",
      description: "A love letter to indie cinema and masters of the craft. The Auteur badge recognizes users who champion independent films and dive into the world of creative, boundary-pushing storytelling. Discover new voices, follow award-winning work, and celebrate the artistry found off the mainstream path.",
      levels: {
        BRONZE: { 
          uri: badges.auteurBronze,
          levelDescription:"Champion of independent film. Watch 20 titles from our list of indies and cult-classics."
        },
        SILVER: {
          uri: badges.auteurSilver,
          levelDescription:"Your appreciation runs deep. Watch 50 titles from our list of indies and cult-classics."
        },
        GOLD: {
          uri: badges.auteurGold,
          levelDescription:"An expert in indie cinema. Watch 100 titles from our list of indies and cult-classics."
        }
      }
    },
    {
      type: "TASTEMAKER",
      description: "Your recommendations matter — and other users know it. The Tastemaker badge is for those whose picks consistently inspire others to add films and shows to their watchlists. When your taste influences the community, you’re not just watching movies… you’re shaping what people watch next.",
      levels: {
        BRONZE: {
          uri: badges.tastemakerBronze,
          levelDescription : "People trust your taste! Earn this badge when titles you recommend are added to Watchlists 5 times by at least 5 different users."
        },
        SILVER: {
          uri: badges.tastemakerSilver,
          levelDescription : "Your influence is spreading! Earn this badge when titles you recommend are added to Watchlists 20 times by at least 10 different users."
          
        },
        GOLD: {
          uri: badges.tastemakerGold ,
          levelDescription : "A true tastemaker! Earn this badge when titles you recommend are added to Watchlists 50 times by at least 15 different users."
        }
      }
    },
    {
      type: "CURATOR",
      description: "Lists aren’t just lists — they’re expressions of taste, mood, and personality. The Curator badge recognizes users who craft meaningful collections that others love engaging with. From niche gems to genre deep-dives, your lists help guide the community toward new discoveries.",
      levels: {
        BRONZE: {
          uri: badges.curatorBronze ,
          levelDescription:"You’re crafting collections! Create 5 Lists, each earning at least 1 upvote."
        },
        SILVER: {
          uri: badges.curatorSilver ,
          levelDescription:"Your lists are gaining traction. Create 10 Lists, each with 5+ upvotes."
        },
        GOLD: {
          uri: badges.curatorGold,
          levelDescription:"A curator with influence. Create 30 Lists, each with 10+ upvotes and 5 comments."
         }
      }
    },
    {
      type: "HISTORIAN",
      description: "Cinema didn’t start today — and the Historian badge honors those who journey into the foundations of film. Explore classics, uncover hidden gems of past decades, and deepen your appreciation for where storytelling began. The more you watch, the more you understand how film evolved.",
      levels: {
        BRONZE: {
          uri: badges.historianBronze,
          levelDescription :"A student of film history. Watch 10 films or shows released before 2000."
        },
        SILVER: {
          uri: badges.historianSilver ,
          levelDescription :"Going deeper into the archives. Watch 30 films released before 1990."
        },
        GOLD: {
          uri: badges.historianGold ,
          levelDescription :"A true historian of cinema. Watch 50 classics released before 1970."
        }
      }
    },
    {
      type: "CONVERSATIONALIST",
      description: "Every great community thrives on conversation — and this badge honors those who keep dialogues alive. The Conversationalist is always jumping into discussions, sharing insights, and engaging with others. If you love talking movies as much as watching them, this badge is for you.",
      levels: {
        BRONZE: {
          uri: badges.conversationalistBronze ,
          levelDescription:"You keep the conversation flowing! Comment on 50 unique Dialogues posts."
        },
        SILVER: {
          uri: badges.conversationalistSilver ,
          levelDescription:"You’re shaping discussions. Comment on 100 unique Dialogues and repost 5 Dialogues from others."
        },
        GOLD: {
          uri: badges.conversationalistGold ,
          levelDescription:"A community voice. Comment on 200 unique Dialogues and repost 20 Dialogues."
        }
      }
    },
    {
      type: "PEOPLES_CHOICE",
      description: "Your posts don’t just exist — they spark reactions. The People’s Choice badge celebrates users whose dialogue posts consistently resonate with the community, earning meaningful engagement. When your thoughts inspire discussion, laughter, debate, or enthusiasm, the crowd takes notice.",
      levels: {
        BRONZE: {
          uri: badges.peoplesChoiceBronze ,
          levelDescription: "Your posts resonate. Have 5 Dialogue posts earn 10+ upvotes each."
        },
        SILVER: {
          uri: badges.peoplesChoiceSilver ,
          levelDescription : "Your dialogues spark engagement. Have 10 Dialogue posts reach 20+ upvotes and 5 comments each."
        },
        GOLD: {
          uri: badges.peoplesChoiceGold,
          levelDescription:"The community’s favorite. Have 20 Dialogue posts hit 50+ upvotes and 20 comments each."
         }
      }
    },
  ];
  