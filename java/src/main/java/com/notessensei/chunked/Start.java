package com.notessensei.chunked;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.function.Consumer;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.io.HttpClientResponseHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Start {

  static final String BASE_URL = "http://localhost:3000/data/";
  static final DateTimeFormatter FOR_TIMESTAMP = DateTimeFormatter.ofPattern("yyy-MMM-dd HH:mm:ss");

  public static void main(String[] args) {

    final String fullURL = BASE_URL + (args.length < 1 ? "1000" : args[0]);
    System.out.println("Starting the application, fetching " + fullURL);
    Start s = new Start();
    s.printToConsole(fullURL);
    System.out.println("Done");
  }

  void printToConsole(final String fullURL) {
    LocalDateTime startTime = LocalDateTime.now();
    System.out.println("Starts at " + startTime.format(FOR_TIMESTAMP));
    try (CloseableHttpClient client = HttpClients.createDefault()) {
      HttpGet get = new HttpGet(fullURL);
      client.execute(get, getResponsehandler(getLineProcessor()));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  Consumer<String> getLineProcessor() {
    ObjectMapper mapper = new ObjectMapper();
    return line -> {
      try {
        ObjectNode node = mapper.readValue(line, ObjectNode.class);
        System.out.printf("%s (%s)%n", node.get("data"), node.get("count"));
      } catch (Exception e) {
        e.printStackTrace();
      }
    };
  }

  HttpClientResponseHandler<Void> getResponsehandler(Consumer<String> lineprocessor) {
    return response -> {
      System.out.println("In response handler");
      HttpEntity entity = response.getEntity();
      try (BufferedReader reader = new BufferedReader(new InputStreamReader(entity.getContent()))) {
        String line = reader.readLine();
        while (line != null) {
          if (!line.equals("[") && !line.equals("]")) {
            String workLine = line.endsWith(",") ? line.substring(0, line.length() - 1) : line;
            lineprocessor.accept(workLine);
          }
          line = reader.readLine();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
      // Nothing to return
      return null;
    };
  }

}
