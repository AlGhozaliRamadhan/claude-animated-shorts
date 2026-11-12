import { Config } from "@remotion/cli/config";

// three.js needs a real GL context, so use ANGLE rather than the software renderer.
Config.setChromiumOpenGlRenderer("angle");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
