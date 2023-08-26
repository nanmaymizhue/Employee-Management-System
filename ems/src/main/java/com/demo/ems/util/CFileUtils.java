package com.demo.ems.util;

import org.apache.commons.io.FileUtils;

import java.io.*;

public class CFileUtils {

    private final static String DEFAULT_FILE_PATH = "C:\\pj\\ems\\upload\\";

    public static String saveFile(InputStream inputStream, String targetFileName) {

        try {
            File destFile = new File(DEFAULT_FILE_PATH + targetFileName);
            FileUtils.copyInputStreamToFile(inputStream, destFile);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return targetFileName;
    }

}
