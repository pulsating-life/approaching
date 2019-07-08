/**
 *   Create by Malson on 2018/4/13
 */
let myHand = 20;

//总闸
function TotalMethod(My1, My2) {
  if ("right" == My1.path1 && "right" == My2.path2) {
    return action01(My1, My2);
  } else if ("right" == My1.path1 && "down" == My2.path2) {
    return action02(My1, My2);
  } else if ("right" == My1.path1 && "left" == My2.path2) {
    return action03(My1, My2);
  } else if ("right" == My1.path1 && "up" == My2.path2) {
    return action04(My1, My2);
  } else if ("down" == My1.path1 && "right" == My2.path2) {
    return action05(My1, My2);
  } else if ("down" == My1.path1 && "down" == My2.path2) {
    return action06(My1, My2);
  } else if ("down" == My1.path1 && "left" == My2.path2) {
    return action07(My1, My2);
  } else if ("down" == My1.path1 && "up" == My2.path2) {
    return action08(My1, My2);
  } else if ("left" == My1.path1 && "right" == My2.path2) {
    return action09(My1, My2);
  } else if ("left" == My1.path1 && "down" == My2.path2) {
    return action10(My1, My2);
  } else if ("left" == My1.path1 && "left" == My2.path2) {
    return action11(My1, My2);
  } else if ("left" == My1.path1 && "up" == My2.path2) {
    return action12(My1, My2);
  } else if ("up" == My1.path1 && "right" == My2.path2) {
    return action13(My1, My2);
  } else if ("up" == My1.path1 && "down" == My2.path2) {
    return action14(My1, My2);
  } else if ("up" == My1.path1 && "left" == My2.path2) {
    return action15(My1, My2);
  } else if ("up" == My1.path1 && "up" == My2.path2) {
    return action16(My1, My2);
  }
}

//右右
function action01(My1, My2) {
  if (My1.x1 < My2.x2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My2.x2 + myHand) + "," + My1.y1;
    let point04 = (My2.x2 + myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 + myHand) + "," + My1.y1;
    let point04 = (My1.x1 + myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point02;
  }
}

//右下
function action02(My1, My2) {
  if (My1.x1 < My2.x2 && My1.y1 > My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My2.x2 + "," + My1.y1;
    return point01 + " " + point03 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + myHand + "," + My1.y1;
    let point04 = (My1.x1 + myHand) + "," + (My2.y2 + myHand);
    let point05 = My2.x2 + "," + (My2.y2 + myHand)
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point02;
  }
}

//右左
function action03(My1, My2) {
  if (My1.x1 < My2.x2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 + myHand) + "," + My1.y1;
    let point04 = (My1.x1 + myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 + myHand) + "," + My1.y1;
    let point04 = (My1.x1 + myHand) + "," + ((My1.y1 + My2.y2) / 2);
    let point05 = (My2.x2 - myHand) + "," + ((My1.y1 + My2.y2) / 2);
    let point06 = (My2.x2 - myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point06 + " " + point02;
  }
}

//右上
function action04(My1, My2) {
  if (My1.x1 < My2.x2 && My1.y1 < My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My2.x2 + "," + My1.y1;
    return point01 + " " + point03 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 + myHand) + "," + My1.y1;
    let point04 = (My1.x1 + myHand) + "," + (My2.y2 - myHand);
    let point05 = My2.x2 + "," + (My2.y2 - myHand);
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point02;
  }
}

//下右
function action05(My1, My2) {
  if (My1.x1 > My2.x2 && My1.y1 < My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + My2.y2;
    return point01 + " " + point03 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 + myHand);
    let point04 = (My2.x2 + myHand) + "," + (My1.y1 + myHand);
    let point05 = (My2.x2 + myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point02;
  }
}

//下下
function action06(My1, My2) {
  if (My1.y1 > My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 + myHand);
    let point04 = My2.x2 + "," + (My1.y1 + myHand);
    return point01 + " " + point03 + " " + point04 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My2.y2 + myHand);
    let point04 = My2.x2 + "," + (My2.y2 + myHand);
    return point01 + " " + point03 + " " + point04 + " " + point02;
  }
}

//下左
function action07(My1, My2) {
  if (My1.x1 < My2.x2 && My1.y1 < My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + My2.y2;
    return point01 + " " + point03 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 + myHand);
    let point04 = (My2.x2 - myHand) + "," + (My1.y1 + myHand);
    let point05 = (My2.x2 - myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point02;
  }
}

//下上
function action08(My1, My2) {
  if (My1.y1 > My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 + myHand);
    let point04 = ((My1.x1 + My2.x2) / 2) + "," + (My1.y1 + myHand);
    let point05 = ((My1.x1 + My2.x2) / 2) + "," + (My2.y2 - myHand);
    let point06 = My2.x2 + "," + (My2.y2 - myHand);
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point06 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 + myHand);
    let point04 = My2.x2 + "," + (My1.y1 + myHand);
    return point01 + " " + point03 + " " + point04 + " " + point02;
  }
}

//左右
function action09(My1, My2) {
  if (My1.x1 < My2.x2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 - myHand) + "," + My1.y1;
    let point04 = (My1.x1 - myHand) + "," + ((My1.y1 + My2.y2) / 2);
    let point05 = (My2.x2 + myHand) + "," + ((My1.y1 + My2.y2) / 2);
    let point06 = (My2.x2 + myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point06 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 - myHand) + "," + My1.y1;
    let point04 = (My1.x1 - myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point02;
  }
}

//左下
function action10(My1, My2) {
  if (My1.x1 > My2.x2 && My1.y1 > My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My2.x2 + "," + My1.y1;
    return point01 + " " + point03 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 - myHand) + "," + My1.y1;
    let point04 = (My1.x1 - myHand) + "," + (My2.y2 + myHand);
    let point05 = My2.x2 + "," + (My2.y2 + myHand);
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point02;
  }
}

//左左
function action11(My1, My2) {
  if (My1.x1 < My2.x2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 - myHand) + "," + My1.y1;
    let point04 = (My1.x1 - myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My2.x2 - myHand) + "," + My1.y1;
    let point04 = (My2.x2 - myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point02;
  }
}

//左上
function action12(My1, My2) {
  if (My1.x1 > My2.x2 && My1.y1 < My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My2.x2 + "," + My1.y1;
    return point01 + " " + point03 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = (My1.x1 - myHand) + "," + My1.y1;
    let point04 = (My1.x1 - myHand) + "," + (My2.y2 - myHand);
    let point05 = My2.x2 + "," + (My2.y2 - myHand);
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point02;
  }
}

//上右
function action13(My1, My2) {
  if (My1.x1 > My2.x2 && My1.y1 > My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + My2.y2;
    return point01 + " " + point03 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 - myHand);
    let point04 = (My2.x2 + myHand) + "," + (My1.y1 - myHand);
    let point05 = (My2.x2 + myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point02;
  }
}

//上下
function action14(My1, My2) {
  if (My1.y1 > My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 - myHand);
    let point04 = My2.x2 + "," + (My1.y1 - myHand);
    return point01 + " " + point03 + " " + point04 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 - myHand);
    let point04 = ((My1.x1 + My2.x2) / 2) + "," + (My1.y1 - myHand);
    let point05 = ((My1.x1 + My2.x2) / 2) + "," + (My2.y2 + myHand);
    let point06 = My2.x2 + "," + (My2.y2 + myHand);
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point06 + " " + point02;
  }
}

//上左
function action15(My1, My2) {
  if (My1.x1 < My2.x2 && My1.y1 > My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + My2.y2;
    return point01 + " " + point03 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 - myHand);
    let point04 = (My2.x2 - myHand) + "," + (My1.y1 - myHand);
    let point05 = (My2.x2 - myHand) + "," + My2.y2;
    return point01 + " " + point03 + " " + point04 + " " + point05 + " " + point02;
  }
}

//上上
function action16(My1, My2) {
  if (My1.y1 > My2.y2) {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My2.y2 - myHand);
    let point04 = My2.x2 + "," + (My2.y2 - myHand);
    return point01 + " " + point03 + " " + point04 + " " + point02;
  } else {
    let point01 = My1.x1 + "," + My1.y1;
    let point02 = My2.x2 + "," + My2.y2;
    let point03 = My1.x1 + "," + (My1.y1 - myHand);
    let point04 = My2.x2 + "," + (My1.y1 - myHand);
    return point01 + " " + point03 + " " + point04 + " " + point02;
  }
}


export default {
  getPoints(sp, ep) {
    return TotalMethod(sp, ep);
  }
}

