package principal;

import java.util.Arrays;
import java.util.Properties;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

public class MensagensKafka implements Runnable{

	private KafkaConsumer<String, String> consumer = null;
    private Properties props = null;
	
    public MensagensKafka() {
    	props = new Properties();
    	
    	props.put("bootstrap.servers", "192.168.25.102:9092");
        props.put("group.id", "mapqueue");
        props.put("auto.offset.reset", "earliest");
        props.put("enable.auto.commit", "true");
        props.put("auto.commit.interval.ms", "1000");
        //props.put("session.timeout.ms", "30000");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        consumer = new KafkaConsumer<String, String>(props);
        consumer.subscribe(Arrays.asList("mapqueue"));
    }
    
    
	public void run() {
		while(true) {
			ConsumerRecords<String, String> records = consumer.poll(500);
	        for (ConsumerRecord<String, String> record : records) {
	            System.out.println(record.value());
	            principal.enviarMensagem(record.value());
	        }
		}
		
	}

}
