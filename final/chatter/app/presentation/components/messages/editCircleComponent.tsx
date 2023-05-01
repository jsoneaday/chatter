import { StyleSheet, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { primary } from "../../theme/colors";
import { bodyFontStyle } from "../../theme/element-styles/textStyles";
import FullSheet from "../modals/fullSheet";

interface EditCircleComponentProps {
  show: boolean;
}

export default function EditCircleComponent({
  show,
}: EditCircleComponentProps) {
  const onPressCancel = () => {};

  const onPressSubmit = async () => {};

  return (
    <FullSheet show={show}>
      <Text>Public and Edit Circle</Text>
    </FullSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  submitBtnContainer: {
    backgroundColor: primary(true),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 15,
    paddingBottom: 15,
    width: "100%",
    position: "absolute",
    bottom: 80,
  },
  body: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    margin: 5,
  },
  bodyTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  txtInput: {
    ...(bodyFontStyle as object),
    paddingLeft: 60,
  },
});
